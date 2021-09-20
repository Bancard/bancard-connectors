import "./ErrorComponent.css";

export const ERRORES = {
  1: "You must provide a valid processID or aliasToken.",
  2: "You must provide a valid processId for this operation.",
  3: "You must provide a valid aliasToken for the Confirmation operation.",
};

type ErrorComponentProps = {
  errorCode: 1 | 2 | 3;
};

export default function ErrorComponent({ errorCode }: ErrorComponentProps) {
  return (
    <div className="error-component-container">
      <section>
        <h1>Error!</h1>
        <h3>{ERRORES[errorCode]}</h3>
      </section>
    </div>
  );
}
