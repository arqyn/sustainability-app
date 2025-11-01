import { AuthService } from './auth.service';
import { SignUpDto, LoginDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    refresh(refreshToken: string): Promise<{
        accessToken: string | undefined;
        refreshToken: string | undefined;
        expiresIn: number | undefined;
    }>;
}
