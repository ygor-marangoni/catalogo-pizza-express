import { ErrorCode } from "../entities/enums";
import { RefreshSessionRepository } from "../repositories/RefreshSessionRepository";

class AuthController {
  constructor(private readonly authService: any, private readonly sessions: RefreshSessionRepository) {}

  private cookieOptions() {
    return { httpOnly: true, sameSite: "lax" as const, secure: process.env.COOKIE_SECURE === "true", maxAge: 604800000, path: "/api/v1/auth" };
  }

  private readRefreshToken(req) {
    return req.headers.cookie?.split(";").map((value) => value.trim()).find((value) => value.startsWith("refresh_token="))?.split("=").slice(1).join("=");
  }

  private async issueSession(res, account, role) {
    const AuthMiddleware = require("../middlewares/AuthMiddleware");
    const token = AuthMiddleware.generateToken(account.id, role);
    const refreshToken = RefreshSessionRepository.createToken();
    await this.sessions.create(refreshToken, account.id, role, new Date(Date.now() + 604800000));
    res.cookie("refresh_token", refreshToken, this.cookieOptions());
    return { token, role };
  }

  async login(req, res, next) {
    try {
      const authenticated = await this.authService.authenticate(req.body.email, req.body.password);
      const session = await this.issueSession(res, authenticated.account, authenticated.role);
      res.json({ success: true, data: { id: authenticated.account.id, name: authenticated.account.name, email: authenticated.account.email, ...session }, error: null });
    } catch (error) { next(error); }
  }

  async registerUser(req, res, next) {
    try {
      const user = await this.authService.registerUser(req.body);
      res.status(201).json({ success: true, data: { id: user.id, name: user.name, email: user.email }, error: null });
    } catch (error) { next(error); }
  }

  async refresh(req, res) {
    const refreshToken = this.readRefreshToken(req);
    if (!refreshToken) return res.status(401).json({ success: false, data: null, error: { code: ErrorCode.UNAUTHORIZED, message: "Refresh token nao fornecido", field: null } });
    const session = await this.sessions.findActive(decodeURIComponent(refreshToken));
    if (!session) return res.status(401).json({ success: false, data: null, error: { code: ErrorCode.INVALID_TOKEN, message: "Refresh token invalido ou expirado", field: null } });
    try {
      const account = await this.authService.getAccountByRole(session.account_id, session.role);
      await this.sessions.revoke(decodeURIComponent(refreshToken));
      const nextSession = await this.issueSession(res, account, session.role);
      res.json({ success: true, data: nextSession, error: null });
    } catch {
      await this.sessions.revoke(decodeURIComponent(refreshToken));
      res.status(401).json({ success: false, data: null, error: { code: ErrorCode.INVALID_TOKEN, message: "Conta ou sessao invalida", field: null } });
    }
  }

  async logout(req, res) {
    const token = this.readRefreshToken(req);
    if (token) await this.sessions.revoke(decodeURIComponent(token));
    res.clearCookie("refresh_token", { ...this.cookieOptions(), maxAge: undefined });
    res.json({ success: true, data: null, error: null });
  }

  async me(req, res, next) {
    try {
      const admin = await this.authService.getAdminById(Number(req.user.id));
      res.json({ success: true, data: { id: admin.id, name: admin.name, email: admin.email, role: "ADMIN" }, error: null });
    } catch (error) { next(error); }
  }
}

module.exports = AuthController;
