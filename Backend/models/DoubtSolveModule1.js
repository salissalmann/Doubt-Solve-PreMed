const mongoose = require('mongoose');

//Schema for Questions that are uploaded by customers.
const Flow1 = new mongoose.Schema(
{
    //user: { type: Schema.Types.ObjectId, ref: 'User' },
    description: { type: String, required: true },
    subject: { type: String, required: true },
    topic: { type: String, required: true },
    resource: { type: String },
    img:
    {
        data: Buffer,
        contentType: String
    },
});

const User = mongoose.model('DoubtSolvemod1' , Flow1);
module.exports = User;