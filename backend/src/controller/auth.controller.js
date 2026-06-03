import userModal from "../modals/user.modal.js"
import { sendEmail } from "../service/mail.service.js"
import jwt from "jsonwebtoken"

export async function register(req, res) {
    const { username, email, password } = req.body

    const isUserAlreadyExist = await userModal.findOne({
        $or: [{ email }, { username }]
    })

    if (isUserAlreadyExist) {
        return res.status(400).json({
            message: "User with this email or username already exists",
            success: false,
            err: "user already exists"
        })
    }

    const user = await userModal.create({
        username,
        email,
        password
    })

    const emailVerificationToken = jwt.sign({
        email: user.email
    }, process.env.JWT_SECRET)

    await sendEmail({
        to: email,
        subject: "Welcome to Perplexity!",
        html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
                 <p>Please verify your email address by clicking the link below:</p>
                 <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
                 <p>If you did not create an account, please ignore this email.</p>
                <p>Best regards,<br>The Perplexity Team</p>
        `
    }).catch(console.error)

    res.status(201).json({
        message: "user registered successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

export async function login(req, res) {

    const { email, password } = req.body

    const user = await userModal.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: "invalid email or password",
            success: false,
            err: "user not found"
        })
    }

    const isPasswordMatch = await user.comparePassword(password)
    if (!isPasswordMatch) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "Incorrect password"
        })
    }

    if (!user.verified) {
        return res.status(400).json({
            message: "please verify your email before logging in",
            success: false,
            err: "email is not verified"
        })
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.cookie("token", token, {
        secure: true,
        sameSite: "none",
        httpOnly: true
    })

    res.status(200).json({
        message: "Login successful",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

export async function getMe(req, res) {

    const userId = req.user.id

    const user = await userModal.findById(userId).select("-password")
    console.log(user)
    if (!user) {
        return res.status(404).json({
            message: "User not found",
            success: false,
            err: "User not found"
        })
    }

    res.status(200).json({
        message: "User details fetched successfully",
        success: true,
        user
    })
}

export async function verify(req, res) {

    const { token } = req.query
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModal.findOne({ email: decoded.email })

        if (!user) {
            return res.status(400).json({
                message: "Invalid token",
                success: false,
                err: "User not found"
            })
        }

        user.verified = true;
        await user.save()

        const html =
            `
        <h1>Email Verified Successfully!</h1>
        <p>Your email has been verified. You can now log in to your account.</p>
        <a href="http://localhost:5173/login">Go to Login</a>
    `

        return res.send(html)
    } catch (err) {
        return res.status(400).json({
            message: "Invalid or expired token",
            success: false,
            err: err.message
        })
    }
}

export async function logout(req, res) {
    const { token } = req.query

    res.clearCookie("token")
    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    })
}