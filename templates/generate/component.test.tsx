import { render, screen } from "@testing-library/react";
import {{COMPONENT_NAME}} from "./{{COMPONENT_NAME}}";

describe("{{COMPONENT_NAME}}", () => {
  it("renders without crashing", () => {
    render(<{{COMPONENT_NAME}} />);
    expect(screen.getByText("{{COMPONENT_NAME}}")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = render(<{{COMPONENT_NAME}} />);
    expect(container).toMatchSnapshot();
  });
});
