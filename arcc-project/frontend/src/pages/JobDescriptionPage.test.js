import React from "react";
import JobDescriptionPage from "./JobDescriptionPage";
import { WorkflowProvider } from "../context/WorkflowContext";
import {
  changeValue,
  click,
  renderWithRoot,
} from "../testUtils/renderWithRoot";

describe("JobDescriptionPage", () => {
  let view;

  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    if (view) {
      view.unmount();
      view = null;
    }
    jest.restoreAllMocks();
  });

  it("submits the entered job title and description", async () => {
    view = renderWithRoot(
      <WorkflowProvider>
        <JobDescriptionPage />
      </WorkflowProvider>,
    );

    const titleInput = view.container.querySelector('input[placeholder="Job Title"]');
    const descriptionInput = view.container.querySelector(
      'textarea[placeholder="Job Description"]',
    );
    const submitButton = view.container.querySelector("button");

    await changeValue(titleInput, "Frontend Developer");
    await changeValue(
      descriptionInput,
      "Build accessible React interfaces and collaborate on testing.",
    );
    await click(submitButton);

    expect(titleInput.value).toBe("Frontend Developer");
    expect(descriptionInput.value).toBe(
      "Build accessible React interfaces and collaborate on testing.",
    );
    expect(console.log).toHaveBeenCalledWith({
      jobTitle: "Frontend Developer",
      description: "Build accessible React interfaces and collaborate on testing.",
    });
  });
});
