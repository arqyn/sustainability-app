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
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let HealthController = class HealthController {
    supabaseService;
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async checkHealth() {
        try {
            const supabase = this.supabaseService.getClient();
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
        }
        catch (error) {
            return {
                status: 'ok',
                timestamp: new Date().toISOString(),
                supabase: 'not tested',
                message: 'API is running (Supabase check skipped)',
            };
        }
    }
    async checkDatabase() {
        try {
            const supabase = this.supabaseService.getClient();
            const { error } = await supabase.from('users').select('count').limit(1);
            return {
                database: error ? 'error' : 'connected',
                message: error ? error.message : 'Database connection successful',
            };
        }
        catch (error) {
            return {
                database: 'error',
                message: error.message,
            };
        }
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "checkHealth", null);
__decorate([
    (0, common_1.Get)('db'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "checkDatabase", null);
exports.HealthController = HealthController = __decorate([
    (0, common_1.Controller)('health'),
    (0, public_decorator_1.Public)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], HealthController);
//# sourceMappingURL=health.controller.js.map