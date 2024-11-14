import { Parser } from 'json2csv';
import * as models from '../models/index.js'; // Import all models
import { fieldsMapping } from '../models/index.js'; // Import fieldsMapping
import createHttpError from 'http-errors';

const exportCSV = async (req, res, next) => {
    const { collection } = req.params;

    console.log('Available collections:', Object.keys(models));
    console.log('Requested collection:', collection);

    // Check if the collection is valid
    if (!models[collection]) {
        return next(createHttpError(400, 'Invalid collection name'));
    }

    const Model = models[collection];

    try {
        let data;
        let include = [];

        if (collection === 'Book') {
            include = [
                { model: models.Author, attributes: ['author_name'] },
                { model: models.Genre, attributes: ['genre_name'] },
                { model: models.Publisher, attributes: ['publisher_name'] },
            ];
        } else if (collection === 'Borrowing') {
            include = [
                { model: models.LibraryCard, attributes: ['reader_name'] },
                { model: models.Employee, attributes: ['full_name'] },
            ];
        } else if (collection === 'BorrowingDetails') {
            include = [
                {
                    model: models.Borrowing,
                    attributes: ['borrow_id', 'borrow_date', 'is_returned'], // Include borrow_date and is_returned
                    include: [
                        { model: models.LibraryCard, attributes: ['reader_name'] },
                        { model: models.Employee, attributes: ['full_name'] },
                    ],
                },
                { model: models.Book, attributes: ['title'] },
            ];
        }

        // Fetch data from the database
        data = await Model.findAll({
            include,
        });

        if (!data || data.length === 0) {
            return next(createHttpError(404, 'No data found for this collection'));
        }

        // Use fields from fieldsMapping
        let fields = fieldsMapping[collection];

        // Map data according to fieldsMapping
        data = data.map((record) => {
            const mappedRecord = {};

            fields.forEach((field) => {
                if (field.includes('.')) {
                    // Handle nested fields
                    const fieldParts = field.split('.');
                    let value = record;

                    fieldParts.forEach((part) => {
                        value = value ? value[part] : null;
                    });

                    // Custom handling for specific fields
                    if (field === 'Borrowing.is_returned') {
                        mappedRecord[field] = value ? 'Đã trả' : 'Chưa trả';
                    } else if (field === 'Borrowing.borrow_date') {
                        // Format borrow_date if needed, e.g., toLocaleDateString
                        mappedRecord[field] = value ? new Date(value).toLocaleDateString('vi-VN') : '';
                    } else {
                        mappedRecord[field] = value;
                    }
                } else {
                    mappedRecord[field] = record[field];
                }
            });

            return mappedRecord;
        });

        const opts = { fields };
        const parser = new Parser(opts);
        const csvWithoutBOM = parser.parse(data);
        const csv = '\uFEFF' + csvWithoutBOM; // Add BOM for UTF-8 support in Excel

        res.header('Content-Type', 'text/csv; charset=utf-8');
        res.attachment(`${collection}.csv`);
        return res.send(csv);
    } catch (error) {
        console.error(error);
        return next(createHttpError(500, 'An error occurred while exporting CSV'));
    }
};

export { exportCSV };
