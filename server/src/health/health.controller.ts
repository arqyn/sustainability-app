
import { Controller, Get } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('health')
@Public() // Make health checks public (no auth required)
export class HealthController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get()
  async checkHealth() {
    try {
      const supabase = this.supabaseService.getClient();
      
      // Try a simple query to check connection
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        supabase: error ? 'disconnected' : 'connected',
        message: 'API is running successfully',
      };
    } catch (error) {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        supabase: 'not tested',
        message: 'API is running (Supabase check skipped)',
      };
    }
  }

  @Get('db')
  async checkDatabase() {
    try {
      const supabase = this.supabaseService.getClient();
      const { error } = await supabase.from('users').select('count').limit(1);
      
      return {
        database: error ? 'error' : 'connected',
        message: error ? error.message : 'Database connection successful',
      };
    } catch (error) {
      return {
        database: 'error',
        message: error.message,
      };
    }
  }
}