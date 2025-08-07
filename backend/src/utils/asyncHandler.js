



const asyncHandler = (requestHandler) => {
    // Ye return karega ek new function jo req/res/next leta hai
    return (req, res, next) => {
        // requestHandler ko promise bana ke run karo
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => next(err)); // Agar error aayi to usko next(err) karo
    }
}

export {
    asyncHandler

}
