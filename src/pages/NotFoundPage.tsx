import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="section not-found">
      <div className="container">
        <span className="eyebrow">404</span>
        <h1>Página não encontrada</h1>
        <p>O endereço que você tentou acessar não existe ou foi alterado.</p>
        <Link to="/" className="btn btn-secondary"><ArrowLeft size={18} />Voltar ao início</Link>
      </div>
    </section>
  );
}
