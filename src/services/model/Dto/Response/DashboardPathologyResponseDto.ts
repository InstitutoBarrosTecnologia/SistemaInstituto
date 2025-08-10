/// <summary>
/// DTO para resposta de patologias agrupadas no dashboard
/// </summary>
export interface DashboardPathologyResponseDto {
  /// <summary>
  /// Nome da patologia
  /// </summary>
  patologia: string;

  /// <summary>
  /// Quantidade de pacientes com esta patologia
  /// </summary>
  quantidade: number;

  /// <summary>
  /// Percentual que representa esta patologia do total
  /// </summary>
  percentual: number;
}
