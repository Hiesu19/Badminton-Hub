import { Routes, Route } from 'react-router-dom';
import ClientAuthLanding from '../pages/ClientAuthLanding.jsx';

/**
 * Định nghĩa toàn bộ routes cho app client.
 * App.jsx sẽ chỉ import và render `AppRoutes`.
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Landing + Auth cho client */}
      <Route path="/" element={<ClientAuthLanding />} />
    </Routes>
  );
}


