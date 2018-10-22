from random import randint

def getRandomOne():
    return randint(0, 99)
def getRandomTwo():
    return randint(1, 20)

file = open("testData.txt","w")

for i in range(0,100000):
    s = "["
    for j in range(0,7):
        r = getRandomOne()
        if r < 2:
            s = s + ","
        else:
            s = s + str(getRandomTwo()) + ","

    r = getRandomOne()
    if r < 2:
        s = s + "]\n"
    else:
        s = s + "low]\n"

    r = getRandomOne()
    if r < 5:
        s = "[]\n"

    print s
    file.write(s)

file.close()