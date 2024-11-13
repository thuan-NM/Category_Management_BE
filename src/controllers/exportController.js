import { Parser } from 'json2csv';
import * as models from '../models/index.js'; // Import tất cả các models từ index.js
import { fieldsMapping } from '../models/index.js'; // Import fieldsMapping từ index.js
import createHttpError from 'http-errors';

const exportCSV = async(req, res, next) => {
    const { collection } = req.params;

    console.log('Available collections:', Object.keys(models));
    console.log('Requested collection:', collection);

    // Kiểm tra xem collection có hợp lệ không
    if (!models[collection]) {
        return next(createHttpError(400, 'Invalid collection name'));
    }

    const Model = models[collection];

    try {
        let data;

        // Tạo đối tượng include để lấy dữ liệu join
        let include = [];

        if (collection === 'Book') {
            include = [{
                    model: models.Author,
                    attributes: ['author_name']
                },
                {
                    model: models.Genre,
                    attributes: ['genre_name']
                },
                {
                    model: models.Publisher,
                    attributes: ['publisher_name']
                }
            ];
        } else if (collection === 'Borrowing') {
            include = [{
                    model: models.LibraryCard,
                    attributes: ['reader_name']
                },
                {
                    model: models.Employee,
                    attributes: ['full_name']
                }
            ];
        } else if (collection === 'BorrowingDetails') {
            include = [{
                    model: models.Borrowing,
                    attributes: ['borrow_id']
                },
                {
                    model: models.Book,
                    attributes: ['title']
                }
            ];
        }

        // Lấy dữ liệu từ bảng với JOIN nếu có include
        data = await Model.findAll({
            raw: true,
            include
        });

        if (!data || data.length === 0) {
            return next(createHttpError(404, 'No data found for this collection'));
        }

        // Chuyển đổi giá trị id sang tên nếu cần thiết
        if (collection === 'Book') {
            data = data.map(book => ({
                ...book,
                author_name: book['Author.author_name'],
                genre_name: book['Genre.genre_name'],
                publisher_name: book['Publisher.publisher_name']
            }));
        } else if (collection === 'Borrowing') {
            data = data.map(borrowing => ({
                ...borrowing,
                reader_name: borrowing['LibraryCard.reader_name'],
                employee_name: borrowing['Employee.full_name']
            }));
        } else if (collection === 'BorrowingDetails') {
            data = data.map(detail => ({
                ...detail,
                borrowing_id: detail['Borrowing.borrow_id'],
                book_title: detail['Book.title']
            }));
        }

        // Sử dụng fields từ fieldsMapping được import từ index.js
        let fields = fieldsMapping[collection];
        if (collection === 'Book') {
            // Thay thế author_id, genre_id, publisher_id bằng tên tương ứng trong phần xuất CSV
            fields = fields.map(field => {
                if (field === 'author_id') return 'author_name';
                if (field === 'genre_id') return 'genre_name';
                if (field === 'publisher_id') return 'publisher_name';
                return field;
            });
        } else if (collection === 'Borrowing') {
            fields = fields.map(field => {
                if (field === 'card_number') return 'reader_name';
                if (field === 'employee_id') return 'employee_name';
                return field;
            });
        } else if (collection === 'BorrowingDetails') {
            fields = fields.map(field => {
                if (field === 'borrow_id') return 'borrowing_id';
                if (field === 'book_id') return 'book_title';
                return field;
            });
        }

        const opts = { fields };
        const parser = new Parser(opts);
        const csvWithoutBOM = parser.parse(data);
        const csv = '\uFEFF' + csvWithoutBOM; // Thêm BOM để hỗ trợ UTF-8 trong Excel

        res.header('Content-Type', 'text/csv; charset=utf-8');
        res.attachment(`${collection}.csv`);
        return res.send(csv);
    } catch (error) {
        console.error(error);
        return next(createHttpError(500, 'An error occurred while exporting CSV'));
    }
};

export { exportCSV };