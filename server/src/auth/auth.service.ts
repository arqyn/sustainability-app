import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { SignUpDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async signUp(signUpDto: SignUpDto) {
    const supabase = this.supabaseService.getClient();

    // Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: signUpDto.email,
      password: signUpDto.password,
      options: {
        data: {
          full_name: signUpDto.fullName,
        },
      },
    });

    if (authError) {
      throw new BadRequestException(authError.message);
    }

    // Create user profile in public.users table
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email: signUpDto.email,
            full_name: signUpDto.fullName,
            created_at: new Date().toISOString(),
          },
        ]);

      if (profileError) {
        // If profile creation fails, we should ideally rollback auth user
        // For now, we'll just log it
        console.error('Profile creation error:', profileError);
      }
    }

    return {
      user: {
        id: authData.user?.id,
        email: authData.user?.email,
        fullName: signUpDto.fullName,
      },
      session: authData.session,
      message: 'User registered successfully. Please check your email for verification.',
    };
  }

  async login(loginDto: LoginDto) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginDto.email,
      password: loginDto.password,
    });

    if (error) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        fullName: profile?.full_name,
      },
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresIn: data.session.expires_in,
    };
  }

  async validateToken(accessToken: string) {
    const supabase = this.supabaseService.getClient();

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      throw new UnauthorizedException('Invalid token');
    }

    return user;
  }

  async refreshToken(refreshToken: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return {
      accessToken: data.session?.access_token,
      refreshToken: data.session?.refresh_token,
      expiresIn: data.session?.expires_in,
    };
  }
}