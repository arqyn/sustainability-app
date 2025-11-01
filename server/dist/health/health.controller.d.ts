import { SupabaseService } from '../supabase/supabase.service';
export declare class HealthController {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    checkHealth(): Promise<{
        status: string;
        timestamp: string;
        supabase: string;
        message: string;
    }>;
    checkDatabase(): Promise<{
        database: string;
        message: any;
    }>;
}
