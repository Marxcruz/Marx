'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('HistoriasClinicas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      hc: {
        type: Sequelize.STRING(100)
      },
      ultimoRegistro: {
        type: Sequelize.DATE
      },
      personaId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Personas'
          },
          key: 'id'
        }
      },
      cajaId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName:'Cajas'
          },
          key: 'id'
        }
      },
      vigente: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('HistoriasClinicas');
  }
};