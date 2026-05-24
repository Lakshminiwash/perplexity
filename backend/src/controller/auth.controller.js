import userModal from "../modals/user.modal.js"
import { sendEmail } from "../service/mail.service.js"

export async function register(req,res) {
    const {username,email,password} = req.body

    const isUserAlreadyExist = await userModal.findOne({
        $or:[{email},{username}]
    })

    if(isUserAlreadyExist){
        return res.status(400).json({
            message:"User with this email or username already exists",
            success:false,
            err:"user already exists"
        })
    }

    const user = await userModal.create({
        username,
        email,
        password
    })

    await sendEmail({
        to: email,
        subject: "Welcome to Perplexity!",
        html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
                <p>Best regards,<br>The Perplexity Team</p>
        `
    })

    res.status(201).json({
        message:"user registered successfully",
        success:true,
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}