const createEmailTemplate = ({ otp, subject }) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${subject}</title>
        </head>

        <body style="
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
        ">

            <div style="
                max-width: 500px;
                margin: 40px auto;
                padding: 30px;
                background-color: #ffffff;
                border-radius: 10px;
                text-align: center;
            ">

                <h2 style="
                    color: #6c63ff;
                    margin-bottom: 20px;
                ">
                    Saraha App
                </h2>

                <h3 style="color: #333333;">
                    ${subject}
                </h3>

                <p style="
                    color: #666666;
                    font-size: 16px;
                ">
                    Your OTP verification code is:
                </p>

                <div style="
                    margin: 25px 0;
                    padding: 15px;
                    background-color: #f0f0ff;
                    border-radius: 8px;
                ">
                    <h1 style="
                        color: #6c63ff;
                        font-size: 32px;
                        letter-spacing: 8px;
                        margin: 0;
                    ">
                        ${otp}
                    </h1>
                </div>

                <p style="
                    color: #777777;
                    font-size: 14px;
                ">
                    Please do not share this code with anyone.
                </p>

                <p style="
                    color: #999999;
                    font-size: 12px;
                    margin-top: 25px;
                ">
                    If you did not request this code, please ignore this email.
                </p>

            </div>

        </body>
        </html>
    `;
};

export default createEmailTemplate;