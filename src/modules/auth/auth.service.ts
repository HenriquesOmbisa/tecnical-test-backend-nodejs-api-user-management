import { injectable, inject } from "tsyringe";
import { IUserRepository } from "@/modules/users/user.repository";
import { UserService } from "@/modules/users/user.service";
import { JwtService } from "@/infra/auth/jwt.service";
import { PasswordService } from "@/infra/auth/password.service";
import { RegisterDto } from "./auth.schema";

@injectable()
export class AuthService {
    constructor(
        @inject(IUserRepository) private readonly userRepo: IUserRepository,
        @inject(UserService) private readonly userService: UserService,
        @inject(JwtService) private readonly jwt: JwtService,
        @inject(PasswordService) private readonly password: PasswordService
    ) {}

    async login(email: string, password: string): Promise<{ accessToken: string }> {
        const user = await this.userRepo.findByEmail(email);
        if (!user) throw new Error("Credenciais inválidas");

        const isValid = await this.password.verify(password, user.password);
        if (!isValid) throw new Error("Credenciais inválidas");

        const token = this.jwt.generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        return { accessToken: token };
    }

    async register(dto: RegisterDto): Promise<{ accessToken: string }> {
        const hashedPassword = await this.password.hash(dto.password);
        const user = await this.userService.register({
            ...dto,
            password: hashedPassword,
            role: "user",
        });

        const token = this.jwt.generateToken({
            userId: user.id,
            email: user.email,
            role: "user",
        });

        return { accessToken: token };
    }
}
