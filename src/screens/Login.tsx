import { useState, type FormEvent } from 'react';
import { login, LOGIN_ERROR_TEXT } from '../services/AuthService';
import { AssetImage } from '../ui/AssetImage';
import { Frame } from '../ui/Frame';
import { Layout } from '../ui/Layout';
import { PixelButton } from '../ui/PixelButton';

function prefilledUsername(): string {
  return new URLSearchParams(location.search).get('u') ?? '';
}

/** [AUTH-8] */
export function LoginScreen() {
  const [username, setUsername] = useState(prefilledUsername);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    const result = await login(username, password.trim());
    setBusy(false);
    if (result) setError(LOGIN_ERROR_TEXT[result]);
  };

  return (
    <Layout
      bare
      top={
        <div className="title-screen">
          <AssetImage id="bg.great_hall" w={256} h={192} className="scene-bg" />
          <div className="title-overlay">
            <h1 className="title">Hogwarts</h1>
            <div className="subtitle">und die Adventsuhr</div>
          </div>
        </div>
      }
      bottom={
        <form className="login" onSubmit={submit}>
          <Frame className="login-frame">
            <label className="field">
              <span>Eulenname</span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="username"
                spellCheck={false}
              />
            </label>
            <label className="field">
              <span>Zauberwort</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoCapitalize="none"
                autoComplete="current-password"
              />
            </label>
            {error && <div className="error">{error}</div>}
          </Frame>
          <PixelButton type="submit" variant="wax" disabled={busy || !username || !password}>
            {busy ? '…' : 'Eintreten'}
          </PixelButton>
        </form>
      }
    />
  );
}
