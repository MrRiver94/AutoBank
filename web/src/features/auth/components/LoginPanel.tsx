import { useState } from 'react'
import type { DemoAccount } from '../model/demoAccount'

type LoginPanelProps = {
  accounts: DemoAccount[]
  onLogin: (username: string, password: string) => boolean
}

export function LoginPanel({ accounts, onLogin }: LoginPanelProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const isValid = onLogin(username, password)

    if (!isValid) {
      setErrorMessage('Usuario o contraseña incorrectos para este entorno de pruebas.')
      return
    }

    setErrorMessage('')
  }

  return (
    <aside className="login-panel">
      <div className="login-panel__header">
        <p className="eyebrow">Access Control</p>
        <h2>Acceso local de pruebas</h2>
        <p>
          Identificate para entrar como administrador o usuario estándar en este
          entorno demo.
        </p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <label className="login-field">
          <span>Usuario</span>
          <input
            autoComplete="username"
            placeholder="Introduce tu usuario"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>

        <label className="login-field">
          <span>Contraseña</span>
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Introduce tu contrasena"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        {errorMessage ? <p className="login-error">{errorMessage}</p> : null}

        <button className="login-button" type="submit">
          Entrar al entorno local
        </button>
      </form>

      <div className="demo-accounts">
        <h3>Usuarios disponibles</h3>
        <ul>
          {accounts.map(({ user, password }) => (
            <li key={user.id}>
              <strong>{user.username}</strong>
              <span>{user.role}</span>
              <small>{password}</small>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
