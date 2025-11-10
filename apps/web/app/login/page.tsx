import { LoginForm } from '../components/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex justify-center items-baseline min-h-screen p-4 bg-ps-bg transition-colors">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-ps-card">
        <h1 className="text-2xl font-bold text-ps-primary mb-6 text-center">Sign in with Magic Link</h1>
        <LoginForm />
      </div>
    </div>
  );
}
