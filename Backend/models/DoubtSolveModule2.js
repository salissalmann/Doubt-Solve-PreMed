const mongoose = require('mongoose');

//Schema for Questions that are uploaded by customers.
const Flow2 = new mongoose.Schema(
{
    //user: { type: Schema.Types.ObjectId, ref: 'User' },
    description: { type: String, required: true },
    img:
    {
        data: Buffer,
        contentType: String
    },
});

const User = mongoose.model('DoubtSolvemod2' , Flow2);
module.exports = User;