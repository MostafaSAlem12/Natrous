
const Tour = require('./../models/tourModel')
const qs = require('qs');
const APIFeatures = require('./../utils/apiFeatures')



exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};


exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);


    // Execute the query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limnitFields()
      .paginate();
    const tours = await features.query;

    // Respond to the request
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid data',
      error: err.message
    });
  }
};


exports.getTour = async (req, res) => {

  const tour = await Tour.findById(req.params.id)
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found'
    });
  }
  try {
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    })
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "invalid data"
    })
  }
}



exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }

    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "invalid data  "
    })
  }
}



exports.updateTour = async (req, res) => {
  try {
    const updTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    if (!updTour) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tour not found'
      });
    }

    res.status(200).json({
      status: 'Updated!',
      data: {
        tour: updTour,
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "invalid data  "
    })
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const delTour = await Tour.findByIdAndDelete(req.params.id);
    if (!delTour) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tour not found'
      });
    }

    res.status(200).json({
      status: 'Deleted!',
      data: delTour
    });


  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "invalid data  "
    })
  }

};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: { avgPrice: 1 }
      }
      // {
      //   $match: { _id: { $ne: 'EASY' } }
      // }
    ]);

    console.log(stats);

    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getMonthlyPlan = async (req,res)=>{
  try{
    const year = req.params.year *1 ;
    const plan = await Tour.aggregate([
      {
        $unwind : '$startDates'
      },
      {
        $match: {
          startDates : {
            $gte : new Date(`${year}-01-01`),
            $lte : new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group : {
          _id : {$month: '$startDates'},
          numTourStarts : {$sum :1},
          tours : {$push : '$name'}
        }, 
      },
      {
        $addFields : {month : '$_id' }
      },
      {
        $project : {
          _id : 0
        }
      },
      {
        $sort : {numToursStarts: -1}
      },
      {
        $limit : 12
      }
    ])
    

    res.status(200).json({
      status: 'success',
      data: {
        plan
      }
    });

  }catch(err){
    res.status(404).json({
      status: 'fail',
      message: err
    });

  }
}