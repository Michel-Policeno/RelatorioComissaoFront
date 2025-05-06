import React from "react";
import "./DetailedReport.css";

// Função auxiliar para converter serial Excel em data
function excelDateToJSDate(serial) {
  const excelEpoch = new Date(1899, 11, 30);
  const days = Math.floor(serial);
  return new Date(excelEpoch.getTime() + days * 24 * 60 * 60 * 1000);
}

export default function DetailedReport({ dados = [] }) {
  if (!dados.length) return null;

  const hoje = new Date().toLocaleDateString("pt-BR");
  const produtorNome = dados[0]?.["Produtor"] || "Produtor Desconhecido";

  return (
    <section className="detailed-report" id="pagina-detalhada">
      <header className="report-header">
        <img
          src="https://i.postimg.cc/yx0SDj19/logo.png"
          alt="Logo"
          className="overlay-logo"
        />
        <div>
          <h3>{produtorNome}</h3>
          <p className="report-date">Gerado em: {hoje}</p>
        </div>
      </header>

      <table className="report-table">
        <thead>
          <tr>
            <th>Segurado</th>
            <th>Apólice</th>
            <th>Início Vig.</th>
            <th>Parc.</th>
            <th>Pr. Líq. Parc.</th>
            <th>Vl. Repasse</th>
          </tr>
        </thead>
        <tbody>
          {dados.map((item, idx) => {
            const dataRaw = item["Início Vig."];
            let dataFormatada = "-";

            if (typeof dataRaw === "number") {
              const date = excelDateToJSDate(dataRaw);
              dataFormatada = date.toLocaleDateString("pt-BR");
            } else if (
              typeof dataRaw === "string" &&
              !isNaN(Date.parse(dataRaw))
            ) {
              dataFormatada = new Date(dataRaw).toLocaleDateString("pt-BR");
            }

            return (
              <tr key={idx}>
                <td>{item["Segurado"] || "-"}</td>
                <td>{item["Apólice"] || "-"}</td>
                <td>{dataFormatada}</td>
                <td>{item["Parc."] || "-"}</td>
                <td>
                  R${" "}
                  {Number(item["Pr. Líq. Parc."] || 0).toLocaleString("pt-BR")}
                </td>
                <td>
                  R$ {Number(item["Vl. Repasse"] || 0).toLocaleString("pt-BR")}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
