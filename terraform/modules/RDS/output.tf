output "database_writer_endpoint" {
  description = "The connection endpoint for the DB instance."
  value       = aws_db_instance.db_instance.endpoint
}
