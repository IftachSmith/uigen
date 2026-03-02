import { test, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MainContent } from "../main-content";

vi.mock("@/components/chat/ChatInterface", () => ({
  ChatInterface: () => <div data-testid="chat-interface">Chat Interface</div>,
}));

vi.mock("@/components/editor/FileTree", () => ({
  FileTree: () => <div data-testid="file-tree">File Tree</div>,
}));

vi.mock("@/components/editor/CodeEditor", () => ({
  CodeEditor: () => <div data-testid="code-editor">Code Editor</div>,
}));

vi.mock("@/components/preview/PreviewFrame", () => ({
  PreviewFrame: () => <div data-testid="preview-frame">Preview Frame</div>,
}));

vi.mock("@/components/HeaderActions", () => ({
  HeaderActions: () => <div data-testid="header-actions">Header Actions</div>,
}));

vi.mock("@/lib/contexts/file-system-context", () => ({
  FileSystemProvider: ({ children }: any) => <>{children}</>,
}));

vi.mock("@/lib/contexts/chat-context", () => ({
  ChatProvider: ({ children }: any) => <>{children}</>,
}));

vi.mock("@/components/ui/resizable", () => ({
  ResizablePanelGroup: ({ children }: any) => <div>{children}</div>,
  ResizablePanel: ({ children }: any) => <div>{children}</div>,
  ResizableHandle: () => <div />,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const mockProject = {
  id: "test-project",
  name: "Test Project",
  messages: [],
  data: {},
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockUser = {
  id: "user-1",
  email: "test@test.com",
};

// Radix UI TabsTrigger activates on mousedown (not click)
function clickTab(tab: HTMLElement) {
  fireEvent.mouseDown(tab, { button: 0 });
}

test("renders Preview tab as active by default", () => {
  render(<MainContent user={mockUser} project={mockProject} />);

  const previewTab = screen.getByRole("tab", { name: "Preview" });
  const codeTab = screen.getByRole("tab", { name: "Code" });

  expect(previewTab.getAttribute("data-state")).toBe("active");
  expect(codeTab.getAttribute("data-state")).toBe("inactive");
});

test("shows preview content by default", () => {
  render(<MainContent user={mockUser} project={mockProject} />);

  expect(screen.getByTestId("preview-frame")).toBeDefined();
  expect(screen.queryByTestId("code-editor")).toBeNull();
  expect(screen.queryByTestId("file-tree")).toBeNull();
});

test("clicking Code tab switches to code view", () => {
  render(<MainContent user={mockUser} project={mockProject} />);

  const codeTab = screen.getByRole("tab", { name: "Code" });
  clickTab(codeTab);

  expect(screen.queryByTestId("preview-frame")).toBeNull();
  expect(screen.getByTestId("code-editor")).toBeDefined();
  expect(screen.getByTestId("file-tree")).toBeDefined();
});

test("clicking Code tab makes it active", () => {
  render(<MainContent user={mockUser} project={mockProject} />);

  const codeTab = screen.getByRole("tab", { name: "Code" });
  const previewTab = screen.getByRole("tab", { name: "Preview" });

  clickTab(codeTab);

  expect(codeTab.getAttribute("data-state")).toBe("active");
  expect(previewTab.getAttribute("data-state")).toBe("inactive");
});

test("clicking Preview tab after Code tab switches back to preview", () => {
  render(<MainContent user={mockUser} project={mockProject} />);

  const codeTab = screen.getByRole("tab", { name: "Code" });
  const previewTab = screen.getByRole("tab", { name: "Preview" });

  clickTab(codeTab);
  expect(screen.getByTestId("code-editor")).toBeDefined();

  clickTab(previewTab);
  expect(screen.getByTestId("preview-frame")).toBeDefined();
  expect(screen.queryByTestId("code-editor")).toBeNull();
});

test("can toggle between views multiple times", () => {
  render(<MainContent user={mockUser} project={mockProject} />);

  const codeTab = screen.getByRole("tab", { name: "Code" });
  const previewTab = screen.getByRole("tab", { name: "Preview" });

  clickTab(codeTab);
  expect(screen.getByTestId("code-editor")).toBeDefined();

  clickTab(previewTab);
  expect(screen.getByTestId("preview-frame")).toBeDefined();

  clickTab(codeTab);
  expect(screen.getByTestId("code-editor")).toBeDefined();

  clickTab(previewTab);
  expect(screen.getByTestId("preview-frame")).toBeDefined();
});

test("clicking active Preview tab does not switch views", () => {
  render(<MainContent user={mockUser} project={mockProject} />);

  const previewTab = screen.getByRole("tab", { name: "Preview" });

  clickTab(previewTab);

  expect(screen.getByTestId("preview-frame")).toBeDefined();
  expect(previewTab.getAttribute("data-state")).toBe("active");
});

test("clicking active Code tab does not switch views", () => {
  render(<MainContent user={mockUser} project={mockProject} />);

  const codeTab = screen.getByRole("tab", { name: "Code" });

  clickTab(codeTab);
  expect(screen.getByTestId("code-editor")).toBeDefined();

  clickTab(codeTab);
  expect(screen.getByTestId("code-editor")).toBeDefined();
  expect(codeTab.getAttribute("data-state")).toBe("active");
});
