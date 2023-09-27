// Since I did not include an env, I hardcoded the server url
export const createReservation = async (reservation) => {
    const response = await fetch(`http://localhost:8000/reservation/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservation),
    });
    if (!response.ok) {
        if (response.status === 400) {
            const errorMessage = await response.json();
            throw errorMessage["message"]
        } else {
            throw new Error(`HTTP Error: ${response.status}`);
        }
    }

    return response.json();
}

export const updateReservation = async (reservation) => {
    const response = await fetch(`http://localhost:8000/reservation/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservation),
    });
    if (!response.ok) {
        if (response.status === 400) {
            const errorMessage = await response.json();
            throw errorMessage["message"]
        } else {
            throw new Error(`HTTP Error: ${response.status}`);
        }
    }

    return response.json();
}

export const getReservations = async () => {
    const response = await fetch('http://localhost:8000/reservation')
    return await response.json();
}

export const getReservationsByUser = async (userData) => {
    const queryParams = new URLSearchParams(userData);

    const url = `http://localhost:8000/reservation/user-reservation?${queryParams}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }

    return await response.json();
}