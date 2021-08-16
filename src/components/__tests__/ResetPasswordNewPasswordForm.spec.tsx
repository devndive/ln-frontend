import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import * as faker from "faker";
import { ResetPasswordNewPasswordForm } from "../ResetPasswordNewPasswordForm";

test('shows the registration confirmation form', async () => {
    const code = faker.datatype.number({ min: 100000, max: 999999 });
    const password = faker.internet.password();

    let actualCode = "";
    let actualPassword = "";

    const handleNewPasswordMockFn = jest.fn(({ code, newPassword }) => {
        actualCode = code;
        actualPassword = newPassword;
    });

    render(<ResetPasswordNewPasswordForm handleNewPassword={handleNewPasswordMockFn} error="" />);

    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/Please provide the verification code and new password./i);

    fireEvent.change(screen.getByLabelText(/code/i), {
        target: { value: code }
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: password }
    });

    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => expect(handleNewPasswordMockFn).toHaveBeenCalled());

    expect(actualCode).toBe(code.toString());
    expect(actualPassword).toBe(password);
});
