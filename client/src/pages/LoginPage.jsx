import { demoUsers } from "../data/auth";

export default function LoginPage({ email, password, setEmail, setPassword, onLogin, loginError, isAuthenticating }) {
  return (
    <main className="auth-shell">
      <section className="auth-panel card">
        <div className="auth-copy">
          <p className="eyebrow">Ops Hub Access</p>
          <h1>Sign in to your control room.</h1>
          <p>
            Use one of the demo accounts below to open a role-based workspace. Different roles will see different sidebar panels.
          </p>
        </div>

        <form className="auth-form" onSubmit={onLogin}>
          <label>
            <span>Email</span>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {loginError ? <div className="error-banner">{loginError}</div> : null}

          <button className="primary-button" type="submit" disabled={isAuthenticating}>
            {isAuthenticating ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="demo-users">
          <p className="eyebrow">Demo Accounts</p>
          <div className="demo-user-grid">
            {demoUsers.map((user) => (
              <article className="demo-user-card" key={user.id}>
                <strong>{user.roleLabel}</strong>
                <span>{user.name}</span>
                <code>{user.email}</code>
                <code>{user.password}</code>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
