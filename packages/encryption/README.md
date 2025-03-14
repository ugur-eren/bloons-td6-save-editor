# Encryption

The main algorithms used in Bloons TD 6 are AES-CBC with SHA1, PBKDF2, and ZLib for compression.

## Steps

Save file encryption is done in 3 steps.

- Data is prepared by serialize JSON, then encrypt with AES-CBC, then compress with ZLib.
- Header is prepared with some constant values, then the encrypted data is appended to the header.
- Whole file is saved to disk.

### Data

The data section of the save file is in JSON format.

- JSON is serialized to a string with `UTF-8 with BOM` encoding.
- The string is compressed with ZLib level 3.
- An encryption key (256 bit) is generated with PBKDF2 using the password and a salt. If there's no existing salt, a new one is generated.
- The encryption key is split into two parts: the key (128 bit) and the IV (128 bit).
- The compressed string is encrypted with AES-CBC using the key and the IV.
- The encrypted string and salt is passed to the next step to prepare the header.

### Header

Header section of the file is a binary structure, and it's somewhat complex. And the binary structure consists of both little endian and big endian values mixed.

<table>
  <thead>
    <tr>
      <th>Offset</th>
      <th>Size</th>
      <th>Type</th>
      <th>Endian</th>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>0</td>
      <td>8</td>
      <td>2 * int32</td>
      <td>Little</td>
      <td>0x01000000 0x24000000</td>
      <td>2 separate int32LE Version Identifier, constant</td>
    </tr>
    <tr>
      <td>8</td>
      <td>4</td>
      <td>int32</td>
      <td>Little</td>
      <td>Incrementing int32LE</td>
      <td>Counter incrementing on every save</td>
    </tr>
    <tr>
      <td>12</td>
      <td>16</td>
      <td>
        <a href="https://learn.microsoft.com/en-us/dotnet/api/system.guid?view=net-9.0" target="_blank">.NET Guid</a>
      </td>
      <td>Unknown</td>
      <td>
        <a href="https://learn.microsoft.com/en-us/dotnet/api/system.guid?view=net-9.0" target="_blank">.NET Guid</a> saved as int128
      </td>
      <td>A Guid generated for each save file, constant per save file</td>
    </tr>
    <tr>
      <td>28</td>
      <td>8</td>
      <td>Unknown</td>
      <td>Unknown</td>
      <td>Unknown</td>
      <td>An unknown value, constant per save file</td>
    </tr>
    <tr>
      <td>36</td>
      <td>8</td>
      <td>
        <a href="https://learn.microsoft.com/en-us/dotnet/api/system.datetime.tobinary?view=net-9.0" target="_blank">.NET DateTime Binary</a>
      </td>
      <td>Little</td>
      <td>0x33b4f04a_7362dd48</td>
      <td>
        <a href="https://learn.microsoft.com/en-us/dotnet/api/system.datetime?view=net-9.0" target="_blank">.NET DateTime</a>
        (<a href="https://learn.microsoft.com/en-us/dotnet/api/system.datetimekind?view=net-9.0" target="_blank">Kind.Utc</a>)
        <a href="https://learn.microsoft.com/en-us/dotnet/api/system.datetime.tobinary?view=net-9.0" target="_blank">Binary</a>
        representation
      </td>
    </tr>
    <tr>
      <td>44</td>
      <td>8</td>
      <td>int64</td>
      <td>Little?</td>
      <td>0x0200000000000000</td>
      <td>An unknown value of 0x0200000000000000, constant</td>
    </tr>
    <tr>
      <td>52</td>
      <td>24</td>
      <td>byte[24]</td>
      <td>Big</td>
      <td>24-byte binary</td>
      <td>PBKDF2 Salt</td>
    </tr>
    <tr>
      <td>76</td>
      <td>...</td>
      <td>byte[]</td>
      <td>Big</td>
      <td>Rest of the file in binary</td>
      <td>Encrypted Data</td>
    </tr>
  </tbody>
</table>

So, in short, the whole header is 76 bytes long, and the rest of the file is the encrypted data. And the header consists of:

- First 8 bytes: constant (2 little endian int32): 01000000 24000000
- Next 4 bytes: an incrementing little endian int32 save counter
- Next 16 bytes: guid constant per save file
- Next 8 bytes: unknown constant per save file
- Next 8 bytes: DateTime UTC ticks (little endian)
- Next 8 bytes: Unknown constant: 0x0200000000000000
- Next 24 bytes: PBKDF2 Salt
- Rest of the data: JSON Serialized, then ZLib Compressed, then AES-CBC Encrypted data
