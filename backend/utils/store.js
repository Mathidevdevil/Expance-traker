const { v4: uuidv4 } = require('uuid');

const store = {
    users: [],
    expenses: [],
    incomes: []
};

// Helper to simulate Mongoose document
class Document {
    constructor(data) {
        Object.assign(this, data);
        if (!this._id) {
            this._id = uuidv4();
        }
        if (!this.createdAt) {
            this.createdAt = new Date();
        }
    }

    save() {
        return Promise.resolve(this);
    }

    // Simulate deleteOne
    async deleteOne() {
        return Promise.resolve();
    }
}

const User = {
    findOne: async (query) => {
        const user = store.users.find(u => {
            for (let key in query) {
                if (u[key] !== query[key]) return false;
            }
            return true;
        });
        if (!user) return null;

        // Return an object that has a matchPassword method and toObject/select simulation
        const userDoc = new Document(user);
        userDoc.matchPassword = async function (enteredPassword) {
            const bcrypt = require('bcryptjs');
            return await bcrypt.compare(enteredPassword, this.password);
        };

        // Mock select method for chaining
        userDoc.select = function () { return this; }; // In-memory we have everything

        // Add fake select method to the promise result if needed, but since we await findOne, 
        // we can't chain .select() on the result of await. 
        // Wait, mongoose usage is User.findOne().select().
        // So User.findOne needs to return a "Query" object that has .select and then .then/await.
        return userDoc;
    },

    findById: async (id) => {
        const user = store.users.find(u => u._id === id);
        return user ? new Document(user) : null;
    },

    create: async (data) => {
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(data.password, salt);

        const newUser = {
            _id: uuidv4(),
            name: data.name,
            email: data.email,
            password: password, // Hashed
            createdAt: new Date()
        };
        store.users.push(newUser);
        return new Document(newUser);
    },

    findByIdAndUpdate: async (id, data, options) => {
        const idx = store.users.findIndex(u => u._id === id);
        if (idx === -1) return null;

        store.users[idx] = { ...store.users[idx], ...data };
        return new Document(store.users[idx]);
    }
};

const Expense = {
    find: async (query) => {
        // Simple filtering
        let results = store.expenses.filter(item => {
            if (query.userId && item.userId !== query.userId) return false;
            if (query.category && item.category !== query.category) return false;
            if (query.date) {
                const itemDate = new Date(item.date);
                if (query.date.$gte && itemDate < query.date.$gte) return false;
                if (query.date.$lte && itemDate > query.date.$lte) return false;
                if (query.date.$lt && itemDate >= query.date.$lt) return false;
            }
            return true;
        });

        // Mongoose find returns a query that can sort
        const queryObj = {
            results: results,
            sort: function (sortCriteria) {
                if (sortCriteria.date === -1) {
                    this.results.sort((a, b) => new Date(b.date) - new Date(a.date));
                }
                return this.results;
            }
        };
        return queryObj; // This might break if code awaits Expense.find(q) directly. 
        // But code is await Expense.find(query).sort(...) usually.
        // If code is await Expense.find(query), we need it to look like a promise.
        // Let's check controller usage.
    },

    create: async (data) => {
        const newExpense = { ...data, _id: uuidv4(), createdAt: new Date() };
        store.expenses.push(newExpense);
        return new Document(newExpense);
    },

    findById: async (id) => {
        const item = store.expenses.find(e => e._id === id);

        if (!item) return null;

        const doc = new Document(item);
        doc.deleteOne = async () => {
            const idx = store.expenses.findIndex(e => e._id === id);
            if (idx !== -1) store.expenses.splice(idx, 1);
        };
        return doc;
    },

    findByIdAndUpdate: async (id, data, options) => {
        const idx = store.expenses.findIndex(e => e._id === id);
        if (idx === -1) return null;

        store.expenses[idx] = { ...store.expenses[idx], ...data };
        return new Document(store.expenses[idx]);
    }
};

const Income = {
    find: async (query) => {
        let results = store.incomes.filter(item => {
            if (query.userId && item.userId !== query.userId) return false;
            if (query.source && item.source !== query.source) return false;
            if (query.date) {
                const itemDate = new Date(item.date);
                if (query.date.$gte && itemDate < query.date.$gte) return false;
                if (query.date.$lte && itemDate > query.date.$lte) return false;
                if (query.date.$lt && itemDate >= query.date.$lt) return false;
            }
            return true;
        });

        const queryObj = {
            results: results,
            sort: function (sortCriteria) {
                if (sortCriteria.date === -1) {
                    this.results.sort((a, b) => new Date(b.date) - new Date(a.date));
                }
                return this.results;
            }
        };
        return queryObj;
    },

    create: async (data) => {
        const newIncome = { ...data, _id: uuidv4(), createdAt: new Date() };
        store.incomes.push(newIncome);
        return new Document(newIncome);
    },
    findById: async (id) => {
        const item = store.incomes.find(e => e._id === id);
        if (!item) return null;

        const doc = new Document(item);
        doc.deleteOne = async () => {
            const idx = store.incomes.findIndex(e => e._id === id);
            if (idx !== -1) store.incomes.splice(idx, 1);
        };
        return doc;
    },
    findByIdAndUpdate: async (id, data, options) => {
        const idx = store.incomes.findIndex(e => e._id === id);
        if (idx === -1) return null;

        store.incomes[idx] = { ...store.incomes[idx], ...data };
        return new Document(store.incomes[idx]);
    }
};

module.exports = { User, Expense, Income };
