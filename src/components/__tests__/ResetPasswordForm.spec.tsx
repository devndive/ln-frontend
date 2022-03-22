import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { faker } from "@faker-js/faker";
import { ResetPasswordForm } from "../ResetPasswordForm";

test('shows the registration confirmation form', async () => {
    const username = faker.internet.email();

    let actualUsername = "";

    const resetMockFn = jest.fn(({ username }) => {
        actualUsername = username;
    });

    render(<ResetPasswordForm handleResetPassword={resetMockFn} error="" />);

    fireEvent.click(screen.getByRole('button', { name: /send code/i }));
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/Please provide a username./i);

    fireEvent.change(screen.getByLabelText(/username/i), {
        target: { value: username }
    });

    fireEvent.click(screen.getByRole('button', { name: /send code/i }));

    await waitFor(() => expect(resetMockFn).toHaveBeenCalled());

    expect(actualUsername).toBe(username);
});
