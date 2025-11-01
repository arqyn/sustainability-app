"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let AuthService = class AuthService {
    supabaseService;
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async signUp(signUpDto) {
        const supabase = this.supabaseService.getClient();
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
            throw new common_1.BadRequestException(authError.message);
        }
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
    async login(loginDto) {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase.auth.signInWithPassword({
            email: loginDto.email,
            password: loginDto.password,
        });
        if (error) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
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
    async validateToken(accessToken) {
        const supabase = this.supabaseService.getClient();
        const { data: { user }, error } = await supabase.auth.getUser(accessToken);
        if (error || !user) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
        return user;
    }
    async refreshToken(refreshToken) {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase.auth.refreshSession({
            refresh_token: refreshToken,
        });
        if (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        return {
            accessToken: data.session?.access_token,
            refreshToken: data.session?.refresh_token,
            expiresIn: data.session?.expires_in,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], AuthService);
//# sourceMappingURL=auth.service.js.map