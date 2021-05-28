const catchAsync = require('../helpers/catchAsync');
const AppError = require('../helpers/appError');

exports.createOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.create();

        if (!doc)
            return next(
                new AppError(
                    'The requested document could not be created!',
                    404
                )
            );

        res.status(200).json({
            status: 'success',
            message: `The requested document is created!`,
            data: {
                data: doc,
            },
        });
    });

exports.updateOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, {
            new: true,
        });

        if (!doc)
            return next(
                new AppError(
                    'The requested document could not be updated!',
                    404
                )
            );

        res.status(200).json({
            status: 'success',
            message: `The requested document is updated!`,
            data: {
                data: doc,
            },
        });
    });

exports.deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc) {
            return next(new AppError(`No document found with that ID`, 404));
        }

        res.status(200).json({
            status: 'success',
            data: null,
            message: `The requested document is deleted!`,
        });
    });
