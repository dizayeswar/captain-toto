"use client";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  confirmMessage: string;
  label?: string;
};

export default function DeleteButton({
  action,
  id,
  confirmMessage,
  label = "Delete",
}: Props) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="font-medium text-red-600 hover:underline"
      >
        {label}
      </button>
    </form>
  );
}
