namespace EDMS.Model
{
	public class FacilityCameraData
	{
		public enum Fields { ID, FacilityID, CameraPositionX, CameraPositionY, CameraPositionZ, CameraQuaternionX, CameraQuaternionY, CameraQuaternionZ, CameraQuaternionW, CameraRotationX, CameraRotationY, CameraRotationZ, CameraFov, CameraNear, CameraFar, OrbitTargetX, OrbitTargetY, OrbitTargetZ };

		public int ID { get; set; }
		public int FacilityID { get; set; }
		public double CameraPositionX { get; set; }
		public double CameraPositionY { get; set; }
		public double CameraPositionZ { get; set; }
		public double CameraQuaternionX { get; set; }
		public double CameraQuaternionY { get; set; }
		public double CameraQuaternionZ { get; set; }
		public double CameraQuaternionW { get; set; }
		public double CameraRotationX { get; set; }
		public double CameraRotationY { get; set; }
		public double CameraRotationZ { get; set; }
		public int CameraFov { get; set; }
		public double CameraNear { get; set; }
		public double CameraFar { get; set; }
		public double OrbitTargetX { get; set; }
		public double OrbitTargetY { get; set; }
		public double OrbitTargetZ { get; set; }

		public static string TableName { get { return "EdmsFacilityCameraData"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			isNullable = false;
			return field.ToString();
		}
	}
}
