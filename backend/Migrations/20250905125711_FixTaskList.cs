using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class FixTaskList : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TaskLists_Boards_BoardId",
                table: "TaskLists");

            migrationBuilder.DropForeignKey(
                name: "FK_TaskLists_UserBoards_UserBoardApplicationUserId_UserBoardBoardId",
                table: "TaskLists");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserBoards",
                table: "UserBoards");

            migrationBuilder.DropIndex(
                name: "IX_TaskLists_UserBoardApplicationUserId_UserBoardBoardId",
                table: "TaskLists");

            migrationBuilder.DropColumn(
                name: "UserBoardApplicationUserId",
                table: "TaskLists");

            migrationBuilder.DropColumn(
                name: "UserBoardBoardId",
                table: "TaskLists");

            migrationBuilder.DropColumn(
                name: "UserBoardId",
                table: "TaskLists");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "UserBoards",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER")
                .Annotation("Sqlite:Autoincrement", true);

            migrationBuilder.AlterColumn<int>(
                name: "BoardId",
                table: "TaskLists",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserBoards",
                table: "UserBoards",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_UserBoards_ApplicationUserId_BoardId",
                table: "UserBoards",
                columns: new[] { "ApplicationUserId", "BoardId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_TaskLists_Boards_BoardId",
                table: "TaskLists",
                column: "BoardId",
                principalTable: "Boards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TaskLists_Boards_BoardId",
                table: "TaskLists");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserBoards",
                table: "UserBoards");

            migrationBuilder.DropIndex(
                name: "IX_UserBoards_ApplicationUserId_BoardId",
                table: "UserBoards");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "UserBoards",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER")
                .OldAnnotation("Sqlite:Autoincrement", true);

            migrationBuilder.AlterColumn<int>(
                name: "BoardId",
                table: "TaskLists",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddColumn<string>(
                name: "UserBoardApplicationUserId",
                table: "TaskLists",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "UserBoardBoardId",
                table: "TaskLists",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UserBoardId",
                table: "TaskLists",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserBoards",
                table: "UserBoards",
                columns: new[] { "ApplicationUserId", "BoardId" });

            migrationBuilder.CreateIndex(
                name: "IX_TaskLists_UserBoardApplicationUserId_UserBoardBoardId",
                table: "TaskLists",
                columns: new[] { "UserBoardApplicationUserId", "UserBoardBoardId" });

            migrationBuilder.AddForeignKey(
                name: "FK_TaskLists_Boards_BoardId",
                table: "TaskLists",
                column: "BoardId",
                principalTable: "Boards",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TaskLists_UserBoards_UserBoardApplicationUserId_UserBoardBoardId",
                table: "TaskLists",
                columns: new[] { "UserBoardApplicationUserId", "UserBoardBoardId" },
                principalTable: "UserBoards",
                principalColumns: new[] { "ApplicationUserId", "BoardId" },
                onDelete: ReferentialAction.Cascade);
        }
    }
}
