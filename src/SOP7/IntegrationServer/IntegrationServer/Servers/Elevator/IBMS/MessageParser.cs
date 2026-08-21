using System;
using System.Collections.Generic;
using System.Text;

namespace IntegrationServer.Servers.Elevator.IBMS
{
    using ViewModels.Elevator;

    class MessageParser
    {
        public const byte STX = 0x02;
        public const byte ETX = 0x03;

        public const int DoorClosed = 0;
        public const int DoorUnkown = 1;
        public const int DoorOpened = 2;

        public static Elevator Parse(byte[] bytes, Dictionary<int, Elevator> dicElevators, int maxElevatorID, int minElevatorID)
        {
            int len = bytes.Length;
            int beginIndex = -1, endIndex = -1;

            for (int i = 0; i < len; i++)
            {
                if (bytes[i] == STX || bytes[i] == (byte)'S')
                {
                    beginIndex = i;
                    break;
                }
            }

            for (int i = len-1; i >=0; i--)
            {
                if (bytes[i] == ETX || bytes[i] == (byte)'E')
                {
                    endIndex = i;
                    break;
                }
            }

            if (beginIndex >= 0 && endIndex > beginIndex)
            {
                string strNo = GetString(bytes, beginIndex + 1, endIndex);
                string strFloor = GetString(bytes, beginIndex + 3, endIndex);
                string strDirection = GetDirection(bytes, beginIndex + 5, endIndex);
                int doorStatus = GetDoor(bytes, beginIndex + 6, endIndex);
                string strStatus = GetStatus(bytes, beginIndex + 7, endIndex);

                Elevator elevator = GetElevator(strNo, dicElevators, maxElevatorID, minElevatorID);

                if (elevator != null)
                {
                    int floorIndex = GetFloorIndex(strFloor);

                    elevator.Door = doorStatus;
                    elevator.Direction = int.Parse(strDirection);
                    elevator.Floor = floorIndex;
                    elevator.Run = int.Parse(strStatus);

                    return elevator;
                }
            }

            return null;
        }

        private static int GetDoor(byte[] bytes, int index, int endIndex)
        {
            if (index <= endIndex)
            {
                if (bytes[index] == (byte)'0')
                    return DoorOpened;
                else if (bytes[index] == (byte)'1')
                    return DoorClosed;
            }

            return DoorUnkown;
        }

        private static int GetFloorIndex(string strFloor)
        {
            bool positive = true;

            if (strFloor.StartsWith('B'))
            {
                strFloor = strFloor.Substring(1);
                positive = false;
            }

            int floorIndex = 1;

            if (int.TryParse(strFloor, out floorIndex))
            {
                if (positive)
                    floorIndex--;
                else
                    floorIndex *= (-1);
            }

            return floorIndex;
        }

        private static Elevator GetElevator(string strNo, Dictionary<int, Elevator> dicElevators, int maxElevatorID, int minElevatorID)
        {
            int no;

            if (int.TryParse(strNo.Trim(), out no))
            {
                int elevatorID = minElevatorID + no - 1;

                if (elevatorID >= minElevatorID && elevatorID <= maxElevatorID)
                {
                    Elevator elevator;

                    if (dicElevators.TryGetValue(elevatorID, out elevator))
                        return elevator;
                }
            }

            return null;
        }

        private static string GetStatus(byte[] bytes, int index, int endIndex)
        {
            if (index <= endIndex)
            {
                if (bytes[index] == (byte)'0')
                    return Hyundai.MessageParser.RunNormal;
                else if (bytes[index] == (byte)'1')
                    return Hyundai.MessageParser.RunParking;
                else if (bytes[index] >= (byte)'2' && bytes[index] <= (byte)'7')
                    return Hyundai.MessageParser.RunManual;
                else if (bytes[index] == (byte)'8')
                    return Hyundai.MessageParser.RunElevatorFault;
            }

            return Hyundai.MessageParser.RunCommuncationFail;
        }

        private static string GetDirection(byte[] bytes, int index, int endIndex)
        {
            if (index <= endIndex)
            {
                if (bytes[index] == (byte)'0')
                    return Hyundai.MessageParser.DirectionNone;
                else if (bytes[index] == (byte)'1')
                    return Hyundai.MessageParser.DirectionUp;
                else if (bytes[index] == (byte)'2')
                    return Hyundai.MessageParser.DirectionDown;
            }

            return Hyundai.MessageParser.DirectionNone;
        }

        // 2바이트를 읽어 문자열로 바꾼다.
        private static string GetString(byte[] bytes, int index, int endIndex)
        {
            if (index + 1 <= endIndex)
            {
                byte[] _bytes = new byte[2];
                _bytes[0] = bytes[index];
                _bytes[1] = bytes[index + 1];

                return Encoding.UTF8.GetString(_bytes);
            }

            return null;
        }
    }
}
