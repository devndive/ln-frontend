import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { RegistrationConfirmationForm } from "../RegistrationConfirmationForm"
import * as faker from "faker";

test('shows the registration confirmation form', async () => {
    const code = faker.datatype.number({ min: 100000, max: 999999 });

    let actualCode = "";

    const confirmationMockFn = jest.fn(({ code }) => {
        actualCode = code;
    });

    render(<RegistrationConfirmationForm handleRegistrationConfirmation={confirmationMockFn} error="" />);

    fireEvent.click(screen.getByRole('button', { name: /verify/i }));
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/You need to provide the confirmation code./i);

    fireEvent.change(screen.getByLabelText(/verification code/i), {
        target: { value: code }
    });

    fireEvent.click(screen.getByRole('button', { name: /verify/i }));

    await waitFor(() => expect(confirmationMockFn).toHaveBeenCalled());

    expect(actualCode).toBe(code.toString());
});
