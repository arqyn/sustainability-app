-- 1. USERS TABLE (Profile Data)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  total_points INTEGER DEFAULT 0,
  streak_count INTEGER DEFAULT 0,
  last_action_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- =====================================================
-- 2. ECO ACTIONS TABLE (Master List of Actions)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.eco_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- 'recycling', 'transportation', 'energy', 'water', 'food', 'other'
  points INTEGER NOT NULL DEFAULT 10,
  co2_saved_kg DECIMAL(10, 2) DEFAULT 0, -- CO2 saved in kg
  icon_name TEXT, -- Icon identifier for frontend
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.eco_actions ENABLE ROW LEVEL SECURITY;

-- Policies - All authenticated users can read eco actions
CREATE POLICY "Eco actions are viewable by authenticated users"
  ON public.eco_actions FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only admins can insert/update/delete (for now, allow service role)
CREATE POLICY "Service role can manage eco actions"
  ON public.eco_actions FOR ALL
  USING (auth.role() = 'service_role');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_eco_actions_category ON public.eco_actions(category);
CREATE INDEX IF NOT EXISTS idx_eco_actions_active ON public.eco_actions(is_active);

-- =====================================================
-- 3. USER ECO ACTIONS TABLE (User's Completed Actions)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_eco_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  eco_action_id UUID NOT NULL REFERENCES public.eco_actions(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  points_earned INTEGER NOT NULL,
  co2_saved_kg DECIMAL(10, 2) DEFAULT 0,
  notes TEXT, -- Optional user notes
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_eco_actions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own eco actions"
  ON public.user_eco_actions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own eco actions"
  ON public.user_eco_actions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own eco actions"
  ON public.user_eco_actions FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_eco_actions_user_id ON public.user_eco_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_eco_actions_completed_at ON public.user_eco_actions(completed_at);
CREATE INDEX IF NOT EXISTS idx_user_eco_actions_user_date ON public.user_eco_actions(user_id, completed_at);

-- =====================================================
-- 4. FRIENDS TABLE (Friend Connections)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.friends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

-- Enable Row Level Security
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own friend connections"
  ON public.friends FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can send friend requests"
  ON public.friends FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update friend requests"
  ON public.friends FOR UPDATE
  USING (auth.uid() = friend_id OR auth.uid() = user_id);

CREATE POLICY "Users can delete their friend connections"
  ON public.friends FOR DELETE
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_friends_user_id ON public.friends(user_id);
CREATE INDEX IF NOT EXISTS idx_friends_friend_id ON public.friends(friend_id);
CREATE INDEX IF NOT EXISTS idx_friends_status ON public.friends(status);

-- =====================================================
-- 5. TRIGGERS
-- =====================================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER set_updated_at_users
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_eco_actions
  BEFORE UPDATE ON public.eco_actions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 6. FUNCTION: Update User Stats After Action
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_user_stats_after_action()
RETURNS TRIGGER AS $$
DECLARE
  last_action DATE;
  new_streak INTEGER;
BEGIN
  -- Get user's last action date
  SELECT last_action_date INTO last_action
  FROM public.users
  WHERE id = NEW.user_id;

  -- Calculate new streak
  IF last_action IS NULL THEN
    new_streak := 1;
  ELSIF last_action = CURRENT_DATE THEN
    new_streak := (SELECT streak_count FROM public.users WHERE id = NEW.user_id);
  ELSIF last_action = CURRENT_DATE - INTERVAL '1 day' THEN
    new_streak := (SELECT streak_count FROM public.users WHERE id = NEW.user_id) + 1;
  ELSE
    new_streak := 1; -- Streak broken
  END IF;

  -- Update user stats
  UPDATE public.users
  SET 
    total_points = total_points + NEW.points_earned,
    streak_count = new_streak,
    last_action_date = CURRENT_DATE
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update user stats when action is logged
CREATE TRIGGER update_user_stats_trigger
  AFTER INSERT ON public.user_eco_actions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_stats_after_action();

-- =====================================================
-- 7. SEED DATA: Initial Eco Actions
-- =====================================================
INSERT INTO public.eco_actions (title, description, category, points, co2_saved_kg, icon_name) VALUES
  ('Use Reusable Water Bottle', 'Avoid single-use plastic bottles by using a reusable one', 'recycling', 10, 0.5, 'bottle'),
  ('Take Public Transport', 'Use bus, train, or metro instead of driving', 'transportation', 20, 2.5, 'bus'),
  ('Recycle Paper', 'Properly recycle paper products', 'recycling', 5, 0.3, 'recycle'),
  ('Turn Off Lights', 'Turn off lights when leaving a room', 'energy', 5, 0.4, 'lightbulb'),
  ('Bring Reusable Bags', 'Use reusable bags for shopping', 'recycling', 10, 0.6, 'shopping-bag'),
  ('Bike to Work', 'Cycle instead of driving', 'transportation', 30, 5.0, 'bike'),
  ('Eat Plant-Based Meal', 'Have a vegetarian or vegan meal', 'food', 15, 2.0, 'leaf'),
  ('Unplug Electronics', 'Unplug devices when not in use', 'energy', 10, 0.8, 'plug'),
  ('Take Shorter Shower', 'Reduce shower time to save water', 'water', 10, 1.0, 'droplet'),
  ('Compost Food Waste', 'Compost organic waste instead of throwing away', 'recycling', 15, 1.5, 'trash')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 8. VIEWS: Useful Data Views
-- =====================================================

-- View: User Eco Stats Summary
CREATE OR REPLACE VIEW public.user_eco_stats AS
SELECT 
  u.id AS user_id,
  u.full_name,
  u.total_points,
  u.streak_count,
  u.last_action_date,
  COUNT(uea.id) AS total_actions_completed,
  SUM(uea.co2_saved_kg) AS total_co2_saved,
  COUNT(DISTINCT DATE(uea.completed_at)) AS active_days
FROM public.users u
LEFT JOIN public.user_eco_actions uea ON u.id = uea.user_id
GROUP BY u.id, u.full_name, u.total_points, u.streak_count, u.last_action_date;

-- View: Leaderboard
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
  u.id,
  u.full_name,
  u.total_points,
  u.streak_count,
  RANK() OVER (ORDER BY u.total_points DESC) AS rank
FROM public.users u
ORDER BY u.total_points DESC;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify your schema was created correctly

-- Check tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check eco actions were seeded
SELECT COUNT(*) as eco_actions_count FROM public.eco_actions;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';