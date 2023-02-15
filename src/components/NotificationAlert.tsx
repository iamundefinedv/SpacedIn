import React, { useState } from 'react';
import { Alert } from 'reactstrap';

export default function NotificationAlert({ message, colour }: { message: string, colour: string; }) {
    const [visible, setVisible] = useState(false);

    const onDismiss = () => setVisible(false);

    return (
        <Alert color={colour} isOpen={visible} toggle={onDismiss}>
            {message}
        </Alert>
    );
}
