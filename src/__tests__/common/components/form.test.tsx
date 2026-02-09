import { render, screen } from "@testing-library/react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/common/components/form";
import { Input } from "@/common/components/input";

function FormWithField() {
  const form = useForm({ defaultValues: { email: "" } });
  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

function FormWithError() {
  const form = useForm({
    defaultValues: { email: "" },
    values: { email: "" },
  });
  React.useEffect(() => {
    form.setError("email", { message: "Required" });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- set error once on mount
  }, []);
  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
}

function FormWithMessageChildren() {
  const form = useForm({ defaultValues: { email: "" } });
  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage>Hint text</FormMessage>
          </FormItem>
        )}
      />
    </Form>
  );
}

function FormWithoutFieldContext() {
  const form = useForm({ defaultValues: {} });
  return (
    <Form {...form}>
      <FormItem>
        <FormLabel>Standalone</FormLabel>
        <FormControl>
          <input />
        </FormControl>
        <FormMessage />
      </FormItem>
    </Form>
  );
}

describe("Form (common/components)", () => {
  it("renders form field with label, control and message", () => {
    render(<FormWithField />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("FormMessage shows error message when field has error", async () => {
    render(<FormWithError />);
    expect(await screen.findByText("Required")).toBeInTheDocument();
  });

  it("FormMessage shows children when no error", () => {
    render(<FormWithMessageChildren />);
    expect(screen.getByText("Hint text")).toBeInTheDocument();
  });

  it("useFormField returns empty ids when used outside FormField context", () => {
    render(<FormWithoutFieldContext />);
    expect(screen.getByText("Standalone")).toBeInTheDocument();
  });
});
