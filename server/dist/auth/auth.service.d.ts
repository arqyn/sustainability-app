import { SupabaseService } from '../supabase/supabase.service';
import { SignUpDto, LoginDto } from './dto/auth.dto';
export declare class AuthService {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    signUp(signUpDto: SignUpDto): Promise<{
        user: {
            id: string | undefined;
            email: string | undefined;
            fullName: string;
        };
        session: import("@supabase/auth-js").Session | null;
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: string;
            email: string | undefined;
            fullName: any;
        };
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }>;
    validateToken(accessToken: string): Promise<import("@supabase/auth-js").User>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string | undefined;
        refreshToken: string | undefined;
        expiresIn: number | undefined;
    }>;
}
