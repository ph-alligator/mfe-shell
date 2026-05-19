import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import '@org/ui/styles.css';
import App from './App';
import { resolveRemoteManifest } from './config/remotes.config';

async function bootstrap() {
  const manifest = await resolveRemoteManifest();
  console.info('[shell] Remote manifest', manifest);

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

bootstrap();
