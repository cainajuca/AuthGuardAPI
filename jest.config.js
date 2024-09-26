module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    // testMatch: ['<rootDir>/tests/integration/**/*.test.ts'], // only integration tests
    // testMatch: ['<rootDir>/tests/unit/**/*<filename_and_extension>'], // aim on specific tests
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    moduleNameMapper: {
        '^app$': '<rootDir>/src/app.ts',
        '^routes$': '<rootDir>/src/routes/index.ts',
        '^seeds/(.*)$': '<rootDir>/src/seeds/$1',
        '^config/(.*)$': '<rootDir>/src/config/$1',
        '^controllers/(.*)$': '<rootDir>/src/controllers/$1',
        '^repositories/(.*)$': '<rootDir>/src/repositories/$1',
        '^services/(.*)$': '<rootDir>/src/services/$1',
        '^models/(.*)$': '<rootDir>/src/models/$1',
        '^dtos/(.*)$': '<rootDir>/src/dtos/$1',
        '^utils/(.*)$': '<rootDir>/src/utils/$1',
    },
    setupFiles: ['<rootDir>/jest.setup.js'],
};