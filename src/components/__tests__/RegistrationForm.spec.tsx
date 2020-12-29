import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { RegistrationForm } from "../RegistrationForm"
import * as faker from "faker";

test('shows the registration form', async () => {
    const username = faker.internet.email();
    const password = faker.internet.password();

    let actualUsername = "";
    let actualPassword = "";

    const registrationMockFn = jest.fn(({ username, password }) => {
        actualUsername = username;
        actualPassword = password;
    });

    render(<RegistrationForm handleRegistration={registrationMockFn} error="" />);

    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/email and password are required/i);

    fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: username }
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: password }
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => expect(registrationMockFn).toHaveBeenCalled());

    expect(actualUsername).toBe(username);
    expect(actualPassword).toBe(password);
})