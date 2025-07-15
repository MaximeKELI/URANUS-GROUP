using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UranusGroup.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateChatMessageModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsFromUser",
                table: "ChatMessages",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "SessionId",
                table: "ChatMessages",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "Timestamp",
                table: "ChatMessages",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFromUser",
                table: "ChatMessages");

            migrationBuilder.DropColumn(
                name: "SessionId",
                table: "ChatMessages");

            migrationBuilder.DropColumn(
                name: "Timestamp",
                table: "ChatMessages");
        }
    }
}
