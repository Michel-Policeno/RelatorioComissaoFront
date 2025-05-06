import React, { useState } from "react";
import "./ExportPDFButton.css";

export default function ExportPDFButton({ targetRef, nomeProdutor }) {
  const [gerando, setGerando] = useState(false);

  const gerarHTMLRelatorio = () => {
    const relatorioNode = targetRef?.current;
    if (!relatorioNode) return "";

    // 🔗 URL estática do CSS global gerado pelo Vite
    const cssLink = `<link rel="stylesheet" href="../../dist/relatorio-static/index-DCb0Whu3.css">`;

    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <title>Relatório de Comissões</title>
          ${cssLink}
        </head>
        <body>
          ${relatorioNode.innerHTML}
        </body>
      </html>
    `;
  };

  const handleExport = async () => {
    setGerando(true);
    const input = targetRef?.current;
    if (!input) {
      console.warn("Elemento de referência não encontrado.");
      setGerando(false);
      return;
    }

    const htmlRelatorio = gerarHTMLRelatorio();

    try {
      const response = await fetch("http://localhost:3000/salvaPDF", {
        method: "POST",
        headers: {
          "Content-Type": "text/html",
        },
        body: htmlRelatorio,
      });

      if (!response.ok) throw new Error("Falha ao gerar PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `relatorio-${nomeProdutor}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("❌ Erro ao enviar HTML ou baixar PDF:", error);
    }

    setGerando(false);
  };

  return (
    <div className="export-wrapper">
      <button onClick={handleExport} disabled={gerando}>
        {gerando ? "⏳ Gerando Relatório..." : "📄 Exportar Relatório em PDF"}
      </button>
    </div>
  );
}
