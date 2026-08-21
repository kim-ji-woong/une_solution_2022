using System;
using System.Collections.Generic;
using System.Text;

namespace IntegrationServer.Servers.Elevator.Hyundai
{
    using ViewModels.Elevator;

    class MessageParser
    {
        public const string DoorClosed = "0";
        public const string DoorOpened = "2";

        public const string DirectionNone = "0";
        public const string DirectionUp = "1";
        public const string DirectionDown = "2";

        public const string RunCommuncationFail = "00";
        public const string RunNormal = "01";
        public const string RunManual = "02";
        public const string RunMoving = "03";
        public const string RunMonitor = "04";
        public const string RunElevatorFault = "05";
        public const string RunParking = "06";
        public const string RunFull = "07";
        public const string RunNoMonitor = "08";
        public const string RunNoPower = "09";

        public static List<Elevator> Parse(byte[] bytes, Dictionary<int, Elevator> dicElevators, int maxElevatorID, int minElevatorID)
        {
            int body = 62;
            List<Elevator> elevatorDatas = new List<Elevator>();

            int len = bytes.Length;

            for (int i = 0; i < len; i += body)
            {
                if (i + body - 1 >= len)
                    break;

                Elevator elevator = Read(bytes, i);

                if (elevator != null &&
                    elevator.ID >= minElevatorID && elevator.ID <= maxElevatorID &&
                    elevator.Run >= (int)Elevator.RunStatus.Normal &&
                    elevator.Door >= (int)Elevator.DoorStatus.Closed && elevator.Door <= (int)Elevator.DoorStatus.Opened &&
                    elevator.Direction >= (int)Elevator.DirectionStatus.None && elevator.Direction <= (int)Elevator.DirectionStatus.Down)
                {
                    SetElevatorFloor(elevator, dicElevators);
                    elevatorDatas.Add(elevator);
                }
            }

            return elevatorDatas;
        }

        private static void SetElevatorFloor(Elevator elevator, Dictionary<int, Elevator> dicElevators)
        {
            Elevator realElevator;

            if (dicElevators.TryGetValue(elevator.ID, out realElevator))
            {
                int realFloorIndex = realElevator.MinFloor + elevator.Floor;
                elevator.Floor = realFloorIndex;
                elevator.MaxFloor = realElevator.MaxFloor;
                elevator.MinFloor = realElevator.MinFloor;
            }
        }

        private static Elevator Read(byte[] bytes, int index)
        {
            int floor, equipNo;

            string strEquipNo = Encoding.UTF8.GetString(bytes, index + 4, 2);
            string strRun = Encoding.UTF8.GetString(bytes, index + 6, 2);
            string strFloor = Encoding.UTF8.GetString(bytes, index + 8, 2);
            string strDirection = Encoding.UTF8.GetString(bytes, index + 10, 1);
            string strDoor = Encoding.UTF8.GetString(bytes, index + 11, 1);

            if (int.TryParse(strFloor, out floor))
            {
                Elevator data = new Elevator();

                if (int.TryParse(strEquipNo, out equipNo))
                {
                    data.ID = equipNo;
                }
                else
                    return null;

                data.Run = (int)ReadRunStatus(strRun);
                data.Direction = (int)ReadDirectionStatus(strDirection);
                data.Door = (int)ReadDoor(strDoor);
                data.Floor = floor - 1;

                return data;
            }

            return null;
        }

        private static Elevator.DoorStatus ReadDoor(string strDoor)
        {
            if (strDoor == DoorClosed)
                return Elevator.DoorStatus.Closed;
            else if (strDoor == DoorOpened)
                return Elevator.DoorStatus.Opened;

            return Elevator.DoorStatus.Fault;
        }

        private static Elevator.DirectionStatus ReadDirectionStatus(string strDirection)
        {
            if (strDirection == DirectionNone)
                return Elevator.DirectionStatus.None;
            else if (strDirection == DirectionUp)
                return Elevator.DirectionStatus.Up;
            else if (strDirection == DirectionDown)
                return Elevator.DirectionStatus.Down;

            return Elevator.DirectionStatus.Fault;
        }

        private static Elevator.RunStatus ReadRunStatus(string strRun)
        {
            if (strRun == RunCommuncationFail)
                return Elevator.RunStatus.CommunicationFail;
            else if (strRun == RunNormal)
                return Elevator.RunStatus.Normal;
            else if (strRun == RunManual)
                return Elevator.RunStatus.Manual;
            else if (strRun == RunMoving)
                return Elevator.RunStatus.Moving;
            else if (strRun == RunMonitor)
                return Elevator.RunStatus.Monitor;
            else if (strRun == RunElevatorFault)
                return Elevator.RunStatus.ElevatorFault;
            else if (strRun == RunParking)
                return Elevator.RunStatus.Parking;
            else if (strRun == RunFull)
                return Elevator.RunStatus.Full;
            else if (strRun == RunNoMonitor)
                return Elevator.RunStatus.NoMonitor;
            else if (strRun == RunNoPower)
                return Elevator.RunStatus.NoPower;

            return Elevator.RunStatus.Fault;
        }
    }
}
