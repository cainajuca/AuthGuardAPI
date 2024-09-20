module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    moduleNameMapper: {
        '^controllers/(.*)$': '<rootDir>/src/controllers/$1',
        '^repositories/(.*)$': '<rootDir>/src/repositories/$1',
        '^services/(.*)$': '<rootDir>/src/services/$1',
        '^models/(.*)$': '<rootDir>/src/models/$1',
        '^dtos/(.*)$': '<rootDir>/src/dtos/$1',
        '^utils/(.*)$': '<rootDir>/src/utils/$1',
    },
};
