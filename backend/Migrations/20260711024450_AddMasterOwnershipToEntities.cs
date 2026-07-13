using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddMasterOwnershipToEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MasterId",
                schema: "Gestor",
                table: "Revendedor",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MasterId",
                schema: "Gestor",
                table: "Fornecedor",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MasterId",
                schema: "Gestor",
                table: "Cliente",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MasterId",
                schema: "Gestor",
                table: "Revendedor");

            migrationBuilder.DropColumn(
                name: "MasterId",
                schema: "Gestor",
                table: "Fornecedor");

            migrationBuilder.DropColumn(
                name: "MasterId",
                schema: "Gestor",
                table: "Cliente");
        }
    }
}
